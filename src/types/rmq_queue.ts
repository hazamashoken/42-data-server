export interface RmqQueue {
  arguments: Arguments;
  auto_delete: boolean;
  backing_queue_status: BackingQueueStatus;
  consumer_utilisation: number;
  consumers: number;
  durable: boolean;
  effective_policy_definition: Arguments;
  exclusive: boolean;
  exclusive_consumer_tag: null;
  garbage_collection: GarbageCollection;
  head_message_timestamp: null;
  memory: number;
  message_bytes: number;
  message_bytes_paged_out: number;
  message_bytes_persistent: number;
  message_bytes_ram: number;
  message_bytes_ready: number;
  message_bytes_unacknowledged: number;
  message_stats: MessageStats;
  messages: number;
  messages_details: Details;
  messages_paged_out: number;
  messages_persistent: number;
  messages_ram: number;
  messages_ready: number;
  messages_ready_details: Details;
  messages_ready_ram: number;
  messages_unacknowledged: number;
  messages_unacknowledged_details: Details;
  messages_unacknowledged_ram: number;
  name: string;
  node: string;
  operator_policy: null;
  policy: null;
  recoverable_slaves: null;
  reductions: number;
  reductions_details: Details;
  single_active_consumer_tag: null;
  state: string;
  type: string;
  vhost: string;
}

export interface Arguments {}

export interface BackingQueueStatus {
  avg_ack_egress_rate: number;
  avg_ack_ingress_rate: number;
  avg_egress_rate: number;
  avg_ingress_rate: number;
  delta: Array<number | string>;
  len: number;
  mode: string;
  next_seq_id: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  target_ram_count: string;
}

export interface GarbageCollection {
  fullsweep_after: number;
  max_heap_size: number;
  min_bin_vheap_size: number;
  min_heap_size: number;
  minor_gcs: number;
}

export interface MessageStats {
  ack: number;
  ack_details: Details;
  deliver: number;
  deliver_details: Details;
  deliver_get: number;
  deliver_get_details: Details;
  deliver_no_ack: number;
  deliver_no_ack_details: Details;
  get: number;
  get_details: Details;
  get_empty: number;
  get_empty_details: Details;
  get_no_ack: number;
  get_no_ack_details: Details;
  publish: number;
  publish_details: Details;
  redeliver: number;
  redeliver_details: Details;
}

export interface Details {
  rate: number;
}
