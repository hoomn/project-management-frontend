export type UserProps = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  initials: string;
  email_notification: boolean;
  is_staff: boolean;
};

export type BaseItem = {
  id: string;
  uuid?: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  status: number;
  status_title?: string;
  priority: number;
  priority_title?: string;
  assigned_to: string[];
  created_at?: string;
  updated_at?: string;
  time_since_creation: string;
  time_since_update: string;
  created_by: string;
  is_overdue?: boolean;
  comment_count: number;
  attachment_count: number;
  content_type: string;
};

export type ProjectProps = BaseItem & {
  domain: string;
  domain_title: string;
  task_count: number;
};

export type TaskProps = BaseItem & {
  project: string;
  subtask_count: number;
};

export type SubtaskProps = BaseItem & {
  task: string;
};

export type BaseGeneric = {
  id: string;
  content_type: string;
  object_id: string;
  time_since_creation: string;
  created_at?: string;
  created_by: string;
};

export type CommentProps = BaseGeneric & {
  text: string;
  is_updated: boolean;
  updated_at?: string;
};

export type AttachmentProps = BaseGeneric & {
  file: any;
  extension?: string;
  file_name?: string;
  file_size?: string;
  description?: string;
  is_updated: boolean;
  updated_at?: string;
};

export type ActivityProps = BaseGeneric & {
  get_action_display: string;
  description?: ActivityDescriptionProps[];
};

export type ActivityDescriptionProps = {
  fiels: string;
  verbose_name: string;
  old_value: string;
  new_value: string;
};

export type NotificationProps = BaseGeneric & {
  action: string;
  description?: ActivityDescriptionProps[];
  viewed: boolean;
  url: string | null;
};

export type TodoProps = {
  id?: string;
  description: string;
  due_date: string | null;
  completed?: boolean;
  created_by?: string;
  created_at?: string;
};

export type OptionProps = {
  value: string;
  label: string;
};

export type SortableColumn = {
  key: string;
  label: string;
  sortable?: boolean;
};

export type BorderColor = "gray" | "burgundy" | "navy" | "cyan";
