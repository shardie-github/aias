/**
 * Docs Command - Generate documentation
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export async function docs(options: { rebuild?: boolean } = {}) {
  console.log('📚 Generating documentation...\n');

  const docsDir = path.join(process.cwd(), 'ops', 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Generate API documentation
  console.log('📖 Generating API docs...');
  // Would use typedoc or similar

  // Generate architecture diagrams
  console.log('📐 Generating architecture diagrams...');
  await generateMermaidDiagrams(docsDir);

  // Generate runbooks
  console.log('📋 Generating runbooks...');
  await generateRunbooks(docsDir);

  // Generate HTML index
  console.log('🌐 Generating HTML index...');
  await generateHTMLIndex(docsDir);

  console.log('\n✅ Documentation generated successfully!');
  console.log(`📁 Output: ${docsDir}/index.html`);
}

async function generateMermaidDiagrams(outputDir: string) {
  const diagrams = {
    architecture: `graph TB
    A[Client] --> B[Vercel Edge]
    B --> C[Next.js App]
    C --> D[Supabase]
    C --> E[Prisma WASM]
    C --> F[Redis]
    D --> G[PostgreSQL]
    C --> H[AI Providers]
    C --> I[Stripe]
    `,
    dataflow: `graph LR
    A[User] --> B[API]
    B --> C[RLS]
    C --> D[Database]
    B --> E[Queue]
    E --> F[Worker]
    `,
  };

  for (const [name, diagram] of Object.entries(diagrams)) {
    const filePath = path.join(outputDir, `${name}.mmd`);
    fs.writeFileSync(filePath, diagram);
  }
}

async function generateRunbooks(outputDir: string) {
  const runbooksDir = path.join(process.cwd(), 'ops', 'runbooks');
  if (!fs.existsSync(runbooksDir)) {
    fs.mkdirSync(runbooksDir, { recursive: true });
  }

  const runbooks = {
    'DR.md': `# Disaster Recovery Runbook

## Recovery Objectives
- RTO: 1 hour
- RPO: 15 minutes

## Recovery Steps

1. **Assess Impact**
   - Check monitoring dashboards
   - Identify affected services

2. **Restore from Snapshot**
   \`\`\`bash
   npm run ops restore -- --file <snapshot>
   \`\`\`

3. **Verify Data Integrity**
   \`\`\`bash
   npm run ops check -- --type db
   \`\`\`

4. **Smoke Tests**
   \`\`\`bash
   npm run ops test:e2e
   \`\`\`

5. **Traffic Cutover**
   - Update DNS
   - Verify health checks
   - Monitor metrics
`,
    'INCIDENT.md': `# Incident Response Runbook

## Severity Levels

- **P0**: Complete outage
- **P1**: Major feature down
- **P2**: Degraded performance
- **P3**: Minor issue

## Response Steps

1. **Acknowledge**
   - Update status page
   - Notify team

2. **Investigate**
   - Check logs
   - Review metrics
   - Identify root cause

3. **Mitigate**
   - Enable quiet mode if needed
   - Scale resources
   - Rollback if necessary

4. **Resolve**
   - Deploy fix
   - Verify resolution
   - Post-mortem
`,
  };

  for (const [filename, content] of Object.entries(runbooks)) {
    const filePath = path.join(runbooksDir, filename);
    if (!fs.existsSync(filePath) || (options.rebuild ?? false)) {
      fs.writeFileSync(filePath, content);
    }
  }
}

async function generateHTMLIndex(outputDir: string) {
  const indexPath = path.join(outputDir, 'index.html');
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Operations Documentation</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; }
    h1 { color: #333; }
    .section { margin: 30px 0; }
    .link { display: block; padding: 10px; margin: 5px 0; background: #f0f0f0; border-radius: 4px; text-decoration: none; color: #007bff; }
    .link:hover { background: #e0e0e0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Operations Documentation</h1>
    <p>Generated: ${new Date().toISOString()}</p>
    
    <div class="section">
      <h2>Runbooks</h2>
      <a href="../runbooks/DR.md" class="link">Disaster Recovery</a>
      <a href="../runbooks/INCIDENT.md" class="link">Incident Response</a>
    </div>
    
    <div class="section">
      <h2>Architecture Diagrams</h2>
      <a href="architecture.mmd" class="link">Architecture Diagram</a>
      <a href="dataflow.mmd" class="link">Data Flow Diagram</a>
    </div>
    
    <div class="section">
      <h2>Reports</h2>
      <a href="../reports/rls-audit.md" class="link">RLS Audit</a>
      <a href="../reports/benchmark.html" class="link">Performance Benchmark</a>
    </div>
  </div>
</body>
</html>`;

  fs.writeFileSync(indexPath, html);
}
