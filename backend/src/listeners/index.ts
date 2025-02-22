export const emitEvents = {
  join_video_generation_room_success: "join_video_generation_room_success",
  join_video_render_room_success: "join_video_render_room_success",
  video_generation_success: "video_generation_success",
  video_render_success: "video_render_success",
};

export const onEvents = {
  join_video_generation_room: "join_video_generation_room",
  join_video_render_room: "join_video_render_room",
};

export const roomCreators = {
  create_video_generation_room: (jobId: string) =>
    `video_generation_room_${jobId}`,
  create_video_render_room: (jobId: string) => `video_render_room_${jobId}`,
};
