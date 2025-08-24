#!/usr/bin/env tsx

/**
 * Voila Workflow Management - Simplified workflow + actions.log system
 */

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface WorkflowStep {
  id: number;
  name: string;
  command?: string;
  action?: string;
  file?: string;
  status: 'pending' | 'in_progress' | 'completed';
  started_at?: string;
  completed_at?: string;
  notes?: string;
}

interface WorkflowData {
  project: string;
  current_step: number;
  created_from?: string;
  last_updated: string;
  steps: Record<number, WorkflowStep>;
  user_notes?: string;
}

export class VoilaWorkflow {
  private static ACTIONS_FILE = '.voila/actions.log';
  private static WORKFLOW_FILE = '.voila/workflow.yml';

  static logAction(action: string, description: string) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action}: ${description}\n`;
    
    // Ensure .voila directory exists
    if (!fs.existsSync('.voila')) {
      fs.mkdirSync('.voila', { recursive: true });
    }
    
    // Append to actions log
    fs.appendFileSync(VoilaWorkflow.ACTIONS_FILE, logEntry);
  }

  static completeCurrentStep(description?: string): boolean {
    try {
      const workflowPath = path.join(__dirname, '..', VoilaWorkflow.WORKFLOW_FILE);
      
      if (!fs.existsSync(workflowPath)) {
        console.log('❌ No workflow found');
        return false;
      }

      const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
      const workflow = VoilaWorkflow.parseWorkflowYAML(workflowContent);
      
      const currentStep = workflow.steps[workflow.current_step];
      if (!currentStep) {
        console.log('❌ No current step found');
        return false;
      }

      // Mark current step as completed and advance
      const updatedContent = workflowContent
        .replace(
          new RegExp(`(${workflow.current_step}:[\\s\\S]*?status: ")pending(")`, 'g'),
          `$1completed$2`
        )
        .replace(
          new RegExp(`(current_step: )${workflow.current_step}`),
          `$1${workflow.current_step + 1}`
        );

      fs.writeFileSync(workflowPath, updatedContent);
      
      // Log the completion
      const actionDesc = description || currentStep.name;
      VoilaWorkflow.logAction('step_completed', `Step ${workflow.current_step}: ${actionDesc}`);
      
      return true;
    } catch (error) {
      console.log(`❌ Error updating workflow: ${error}`);
      return false;
    }
  }

  static getStatus(): string {
    const workflowPath = path.join(__dirname, '..', VoilaWorkflow.WORKFLOW_FILE);
    
    if (!fs.existsSync(workflowPath)) {
      return 'No workflow found. Generate one with: npm run generate workflow [app-name]';
    }

    let workflow: WorkflowData;
    try {
      const workflowContent = fs.readFileSync(workflowPath, 'utf-8');
      workflow = VoilaWorkflow.parseWorkflowYAML(workflowContent);
    } catch (error) {
      return `Error reading workflow: ${error}`;
    }

    const completedSteps = Object.values(workflow.steps).filter(s => s.status === 'completed').length;
    const totalSteps = Object.keys(workflow.steps).length;
    const progressPercent = Math.round((completedSteps / totalSteps) * 100);
    
    const currentStep = workflow.steps[workflow.current_step];
    const nextSteps = Object.values(workflow.steps)
      .filter(s => s.status === 'pending')
      .slice(0, 3)
      .map(s => {
        const stepId = Object.keys(workflow.steps).find(k => workflow.steps[parseInt(k)] === s);
        return `${stepId}. ${s.name}`;
      })
      .join('\n   ');

    const recentActions = VoilaWorkflow.getLatestActions(5);
    const recentActionsContent = recentActions.length > 0 
      ? `\n\n## Recent Actions (Last 5)\n${recentActions.map(line => `- ${line}`).join('\n')}` 
      : '';

    return `# Project Status

## Current Progress
- **Project**: ${workflow.project}
- **Step**: ${workflow.current_step}/${totalSteps}
- **Progress**: ${progressPercent}% complete (${completedSteps}/${totalSteps} steps)
- **Last Updated**: ${workflow.last_updated}

## Current Step
${currentStep ? `**${currentStep.name}**` : 'All steps completed!'}
${currentStep?.command ? `Command: \`${currentStep.command}\`` : ''}
${currentStep?.notes ? `Notes: ${currentStep.notes}` : ''}

## Next Steps
   ${nextSteps || 'All workflow steps completed!'}${recentActionsContent}

## Commands
- \`npm run context next\` - Execute current step
- \`npm run context complete "<description>"\` - Mark current step complete`;
  }

  static getLatestActions(count: number = 5): string[] {
    if (!fs.existsSync(VoilaWorkflow.ACTIONS_FILE)) {
      return [];
    }
    
    const content = fs.readFileSync(VoilaWorkflow.ACTIONS_FILE, 'utf-8');
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    return lines.slice(-count);
  }

  static reset() {
    console.log('🔄 Reset Project State');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Remove workflow and actions
    if (fs.existsSync('.voila/workflow.yml')) {
      fs.unlinkSync('.voila/workflow.yml');
      console.log('✅ Removed workflow.yml');
    }
    
    if (fs.existsSync('.voila/actions.log')) {
      fs.unlinkSync('.voila/actions.log');
      console.log('✅ Removed actions.log');
    }
    
    console.log('\n🎯 Fresh start ready!');
    console.log('   Start with: npm run plan start [app-name]');
  }

  // Simple YAML parser for workflow files
  private static parseWorkflowYAML(content: string): WorkflowData {
    const lines = content.split('\n');
    const workflow: Partial<WorkflowData> = {
      steps: {},
      current_step: 1,
      last_updated: new Date().toISOString()
    };
    
    let currentStep: Partial<WorkflowStep> = {};
    let currentStepId = 0;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('project:')) {
        workflow.project = trimmed.split(':')[1]?.trim();
      } else if (trimmed.startsWith('current_step:')) {
        workflow.current_step = parseInt(trimmed.split(':')[1]?.trim() || '1');
      } else if (trimmed.startsWith('last_updated:')) {
        workflow.last_updated = trimmed.split(':')[1]?.trim() || new Date().toISOString();
      } else if (/^\d+:$/.test(trimmed)) {
        if (currentStepId > 0 && currentStep.name) {
          workflow.steps![currentStepId] = currentStep as WorkflowStep;
        }
        currentStepId = parseInt(trimmed.replace(':', ''));
        currentStep = { id: currentStepId, status: 'pending' } as Partial<WorkflowStep>;
      } else if (trimmed.startsWith('name:')) {
        currentStep.name = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
      } else if (trimmed.startsWith('command:')) {
        currentStep.command = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
      } else if (trimmed.startsWith('action:')) {
        currentStep.action = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
      } else if (trimmed.startsWith('file:')) {
        currentStep.file = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
      } else if (trimmed.startsWith('status:')) {
        currentStep.status = trimmed.split(':')[1]?.trim().replace(/"/g, '') as 'pending' | 'in_progress' | 'completed';
      } else if (trimmed.startsWith('notes:')) {
        currentStep.notes = trimmed.split(':').slice(1).join(':').trim().replace(/"/g, '');
      }
    }
    
    // Add the last step
    if (currentStepId > 0 && currentStep.name) {
      workflow.steps![currentStepId] = currentStep as WorkflowStep;
    }
    
    return workflow as WorkflowData;
  }
}