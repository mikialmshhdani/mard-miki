export interface Service {
  id: string;
  title: string;
  icon: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface WorkflowStep {
  id: string;
  question: string;
  type: "text" | "textarea" | "select";
  options?: string[];
  placeholder?: string;
}