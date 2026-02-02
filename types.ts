
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  REVIEWER = 'reviewer'
}

export enum QuestionType {
  BOOLEAN = 'boolean',
  SCALE = 'scale',
  MULTIPLE = 'multiple',
  TEXT = 'text'
}

export enum FormType {
  CENTER_VISIT = 'center_visit',
  MANAGER_EVAL = 'manager_eval',
  EMPLOYEE_SELF = 'employee_self'
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  center_id?: string;
  manager_id?: string;
}

export interface Center {
  id: string;
  name: string;
  location: string;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  type: FormType;
  is_active: boolean;
}

export interface Question {
  id: string;
  form_id: string;
  text: string;
  type: QuestionType;
  max_score: number;
  weight: number;
  sort_order: number;
  category?: string;
  mechanism?: string;
  placeholder?: string;
}

export interface Evaluation {
  id: string;
  form_id: string;
  evaluator_id: string;
  target_id: string;
  total_score: number;
  percentage: number;
  notes: string;
  created_at: string;
}

export interface Visit {
  id: string;
  center_id: string;
  evaluation_id: string;
  visit_date: string;
  visit_number: 1 | 2;
  inspector_id: string;
}
