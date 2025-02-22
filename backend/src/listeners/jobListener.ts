import { Server, Socket } from "socket.io";
// .
import { emitEvents, onEvents, roomCreators } from ".";
// interface
import { IJoinRoomPayload } from "./interface";
import { error } from "console";

export default function (ioServer: Server, socket: Socket) {
  const { join_video_generation_room_success, join_video_render_room_success } =
    emitEvents;

  const { join_video_generation_room, join_video_render_room } = onEvents;

  const { create_video_generation_room, create_video_render_room } =
    roomCreators;

  socket.on(join_video_generation_room, ({ jobId }: IJoinRoomPayload) => {
    socket.join(create_video_generation_room(jobId));

    socket.emit(join_video_generation_room_success, {
      data: jobId,
      error: "",
      success: true,
    });
  });

  socket.on(join_video_render_room, ({ jobId }: IJoinRoomPayload) => {
    socket.join(create_video_render_room(jobId));

    socket.emit(join_video_render_room_success, {
      data: jobId,
      error: "",
      success: true,
    });
  });
}
