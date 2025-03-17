export type Task = {
  activity_id: string;
  state: "pending" | "completed" | "cancelled" | "failed" | "timed_out";
  started_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  percent_done: number;
  activity_errors: any[];
  status: any;
  _links: {
    self: {
      href: string;
    };
    results: {
      href: string;
    };
  };
};
