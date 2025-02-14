import { Server, Socket } from "socket.io";
// .
import { emitEvents, onEvents, roomCreators } from ".";
// interface
import { IJoinRoomPayload } from "./interface";

export default function (ioServer: Server, socket: Socket) {
  const { join_room_success } = emitEvents;

  const { join_room } = onEvents;

  const { create_job_id_room } = roomCreators;

  socket.on(join_room, ({ jobId }: IJoinRoomPayload) => {
    socket.join(create_job_id_room(jobId));

    socket.emit(join_room_success, { data: jobId, error: "", success: true });
  });
}
