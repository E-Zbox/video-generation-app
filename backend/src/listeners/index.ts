export const emitEvents = {
  join_room_success: "join_room_success",
  video_generation_success: "video_generation_success",
};

export const onEvents = {
  join_room: "join_room",
};

export const roomCreators = {
  create_job_id_room: (jobId: string) => `job_id_${jobId}`,
};
