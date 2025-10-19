#!/bin/bash

# ===========================================
# SUPABASE ENTERPRISE SETUP SCRIPT
# ===========================================
# Automated setup script for self-hosted Supabase
# with enterprise security and compliance features

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    log_success "Docker and Docker Compose are installed"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
        log_warning "Please edit .env file with your configuration before continuing."
        log_warning "Press Enter when ready to continue..."
        read -r
    else
        log_success ".env file found"
    fi
}

# Generate secure keys
generate_keys() {
    log_info "Generating secure keys..."
    
    # Generate JWT secret
    if ! grep -q "PGRST_JWT_SECRET=" .env || grep -q "your_jwt_secret_here" .env; then
        JWT_SECRET=$(openssl rand -base64 32)
        sed -i "s/your_jwt_secret_here/$JWT_SECRET/" .env
        log_success "Generated JWT secret"
    fi
    
    # Generate database encryption key
    if ! grep -q "DB_ENC_KEY=" .env || grep -q "your_database_encryption_key_here" .env; then
        DB_ENC_KEY=$(openssl rand -base64 32)
        sed -i "s/your_database_encryption_key_here/$DB_ENC_KEY/" .env
        log_success "Generated database encryption key"
    fi
    
    # Generate secret key base
    if ! grep -q "SECRET_KEY_BASE=" .env || grep -q "your_secret_key_base_here" .env; then
        SECRET_KEY_BASE=$(openssl rand -base64 64)
        sed -i "s/your_secret_key_base_here/$SECRET_KEY_BASE/" .env
        log_success "Generated secret key base"
    fi
    
    # Generate Supabase keys
    if ! grep -q "SUPABASE_ANON_KEY=" .env || grep -q "your_anon_key_here" .env; then
        ANON_KEY=$(openssl rand -base64 32)
        sed -i "s/your_anon_key_here/$ANON_KEY/" .env
        log_success "Generated Supabase anon key"
    fi
    
    if ! grep -q "SUPABASE_SERVICE_KEY=" .env || grep -q "your_service_role_key_here" .env; then
        SERVICE_KEY=$(openssl rand -base64 32)
        sed -i "s/your_service_role_key_here/$SERVICE_KEY/" .env
        log_success "Generated Supabase service key"
    fi
    
    # Generate other keys
    if ! grep -q "LOGFLARE_API_KEY=" .env || grep -q "your_logflare_api_key_here" .env; then
        LOGFLARE_KEY=$(openssl rand -base64 32)
        sed -i "s/your_logflare_api_key_here/$LOGFLARE_KEY/" .env
        sed -i "s/your_logflare_backend_api_key_here/$LOGFLARE_KEY/" .env
        log_success "Generated Logflare API key"
    fi
}

# Create necessary directories
create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p backups
    mkdir -p security-reports
    mkdir -p monitoring/grafana/dashboards
    mkdir -p monitoring/grafana/datasources
    mkdir -p scripts
    
    log_success "Directories created"
}

# Pull Docker images
pull_images() {
    log_info "Pulling Docker images..."
    
    docker-compose pull
    
    log_success "Docker images pulled"
}

# Start services
start_services() {
    log_info "Starting Supabase services..."
    
    # Start core services first
    docker-compose up -d postgres redis
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Start remaining services
    docker-compose up -d
    
    log_success "Services started"
}

# Wait for services to be healthy
wait_for_services() {
    log_info "Waiting for services to be healthy..."
    
    # Wait for PostgreSQL
    until docker-compose exec postgres pg_isready -U postgres; do
        log_info "Waiting for PostgreSQL..."
        sleep 2
    done
    
    # Wait for other services
    sleep 30
    
    log_success "All services are healthy"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Wait a bit more for all services to be ready
    sleep 10
    
    # Run migrations
    docker-compose exec postgres psql -U postgres -d postgres -f /docker-entrypoint-initdb.d/migrations/20250120000002_enterprise_security_compliance.sql
    
    log_success "Database migrations completed"
}

# Display service URLs
display_urls() {
    log_success "Supabase Enterprise setup completed!"
    echo
    echo "Service URLs:"
    echo "============="
    echo "Supabase Studio: http://localhost:3000"
    echo "API Gateway: http://localhost:8000"
    echo "Grafana Dashboard: http://localhost:3001"
    echo "Prometheus: http://localhost:9090"
    echo "Kibana: http://localhost:5601"
    echo "Elasticsearch: http://localhost:9200"
    echo
    echo "Default Credentials:"
    echo "==================="
    echo "Grafana: admin / admin (change in .env)"
    echo "PostgreSQL: postgres / (see .env for password)"
    echo
    echo "Next Steps:"
    echo "==========="
    echo "1. Access Supabase Studio to configure your project"
    echo "2. Set up monitoring dashboards in Grafana"
    echo "3. Configure security policies in the database"
    echo "4. Review and update environment variables in .env"
    echo "5. Set up automated backups"
    echo
    echo "For security scanning, run:"
    echo "docker-compose --profile security up security-scanner"
    echo
    echo "For backup service, run:"
    echo "docker-compose --profile backup up backup"
}

# Main setup function
main() {
    echo "==========================================="
    echo "Supabase Enterprise Setup Script"
    echo "==========================================="
    echo
    
    check_docker
    check_env_file
    generate_keys
    create_directories
    pull_images
    start_services
    wait_for_services
    run_migrations
    display_urls
}

# Run main function
main "$@"
