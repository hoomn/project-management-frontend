export type TokenProps = string | null;

export type UserProps = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  initial: string;
  notification: boolean;
  is_staff: boolean;
};

type BaseItem = {
  id: number;
  uuid?: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  status: number;
  get_status_display?: string;
  priority: number;
  get_priority_display?: string;
  assigned_to: number[];
  created_at?: string;
  updated_at?: string;
  time_since_creation: string;
  time_since_update: string;
  created_by: number;
  is_overdue?: boolean;
  comment_count: number;
  attachment_count: number;
  content_type: number;
};

export type ProjectProps = BaseItem & {
  domain: number;
  domain_title: string;
  task_count: number;
};

type BaseGeneric = {
  id: number;
  time_since_creation: string;
  created_at?: string;
  updated_at?: string;
  created_by: number;
  content_type: number;
  object_id: number;
  is_updated: boolean;
};

export type CommentProps = BaseGeneric & {
  text: string;
};

export type AttachmentProps = BaseGeneric & {
  file: any;
  extension?: string;
  file_name?: string;
  file_size?: string;
  description?: string;
};

export type ActivityProps = {
  id?: number;
  get_action_display: string;
  content_type: string;
  description?: ActivityDescriptionProps[];
  time_since_creation: string;
  created_at?: string;
  created_by: number;
};

export type ActivityDescriptionProps = {
  fiels: string;
  verbose_name: string;
  old_value: string;
  new_value: string;
};

export type NotificationProps = {
  id: number;
  action: string;
  description?: ActivityDescriptionProps[];
  viewed: boolean;
  url: string | null;
  content_type: string;
  time_since_creation: string;
  created_at: string;
};

export type OptionProps = {
  value: number;
  label: string;
};
