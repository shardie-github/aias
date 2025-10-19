#!/bin/bash

# ===========================================
# SUPABASE ENTERPRISE BACKUP SCRIPT
# ===========================================
# Automated backup script for PostgreSQL database
# with encryption, compression, and retention management

set -euo pipefail

# Configuration
BACKUP_DIR="/backups"
DB_HOST="${POSTGRES_HOST:-postgres}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-postgres}"
DB_USER="${POSTGRES_USER:-postgres}"
DB_PASSWORD="${POSTGRES_PASSWORD:-postgres}"

# Backup settings
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
ENCRYPTION_KEY="${BACKUP_ENCRYPTION_KEY:-}"
COMPRESSION_LEVEL="${BACKUP_COMPRESSION_LEVEL:-6}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/supabase_backup_$TIMESTAMP.sql"

# Log function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$BACKUP_DIR/backup.log"
}

# Error handling
error_exit() {
    log "ERROR: $1"
    exit 1
}

# Cleanup function
cleanup() {
    if [ -f "$BACKUP_FILE" ]; then
        rm -f "$BACKUP_FILE"
    fi
}

# Set trap for cleanup
trap cleanup EXIT

log "Starting Supabase backup process..."

# Set PGPASSWORD for pg_dump
export PGPASSWORD="$DB_PASSWORD"

# Create database backup
log "Creating database backup: $BACKUP_FILE"

if pg_dump \
    --host="$DB_HOST" \
    --port="$DB_PORT" \
    --username="$DB_USER" \
    --dbname="$DB_NAME" \
    --verbose \
    --no-password \
    --format=custom \
    --compress="$COMPRESSION_LEVEL" \
    --file="$BACKUP_FILE" \
    --exclude-table-data=security_events \
    --exclude-table-data=performance_metrics \
    --exclude-table-data=system_metrics; then
    
    log "Database backup completed successfully"
else
    error_exit "Database backup failed"
fi

# Encrypt backup if encryption key is provided
if [ -n "$ENCRYPTION_KEY" ]; then
    log "Encrypting backup file..."
    ENCRYPTED_FILE="$BACKUP_FILE.enc"
    
    if echo "$ENCRYPTION_KEY" | gpg --symmetric --cipher-algo AES256 --output "$ENCRYPTED_FILE" "$BACKUP_FILE"; then
        rm "$BACKUP_FILE"
        BACKUP_FILE="$ENCRYPTED_FILE"
        log "Backup encrypted successfully"
    else
        error_exit "Backup encryption failed"
    fi
fi

# Compress backup if not already compressed
if [[ "$BACKUP_FILE" != *.gz ]]; then
    log "Compressing backup file..."
    if gzip "$BACKUP_FILE"; then
        BACKUP_FILE="$BACKUP_FILE.gz"
        log "Backup compressed successfully"
    else
        error_exit "Backup compression failed"
    fi
fi

# Calculate backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log "Backup completed: $BACKUP_FILE (Size: $BACKUP_SIZE)"

# Clean up old backups
log "Cleaning up old backups (retention: $BACKUP_RETENTION_DAYS days)"
find "$BACKUP_DIR" -name "supabase_backup_*" -type f -mtime +$BACKUP_RETENTION_DAYS -delete

# Log backup statistics
BACKUP_COUNT=$(find "$BACKUP_DIR" -name "supabase_backup_*" -type f | wc -l)
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

log "Backup process completed successfully"
log "Total backups: $BACKUP_COUNT"
log "Total backup size: $TOTAL_SIZE"

# Optional: Upload to cloud storage (S3, GCS, etc.)
if [ -n "${BACKUP_S3_BUCKET:-}" ] && [ -n "${AWS_ACCESS_KEY_ID:-}" ]; then
    log "Uploading backup to S3..."
    if aws s3 cp "$BACKUP_FILE" "s3://$BACKUP_S3_BUCKET/backups/"; then
        log "Backup uploaded to S3 successfully"
    else
        log "WARNING: S3 upload failed"
    fi
fi

# Optional: Send notification
if [ -n "${BACKUP_WEBHOOK_URL:-}" ]; then
    log "Sending backup notification..."
    curl -X POST "$BACKUP_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"text\": \"Supabase backup completed successfully\",
            \"attachments\": [{
                \"color\": \"good\",
                \"fields\": [{
                    \"title\": \"Backup File\",
                    \"value\": \"$(basename "$BACKUP_FILE")\",
                    \"short\": true
                }, {
                    \"title\": \"Size\",
                    \"value\": \"$BACKUP_SIZE\",
                    \"short\": true
                }, {
                    \"title\": \"Total Backups\",
                    \"value\": \"$BACKUP_COUNT\",
                    \"short\": true
                }]
            }]
        }" || log "WARNING: Notification failed"
fi

log "Backup process completed successfully"
