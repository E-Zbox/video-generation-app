export const timeFormatter = (timeInSeconds: number): string => {
  const ONE_HOUR = 60 * 60;

  const ONE_MINUTE = 60;

  if (timeInSeconds < ONE_MINUTE) {
    timeInSeconds = Math.floor(timeInSeconds);
    return `0:${String(timeInSeconds).padStart(2, "0")}`;
  }

  const hours = Math.floor(timeInSeconds / 3600);
  const hoursRemainder = timeInSeconds % 3600;

  const minutes = Math.floor(hoursRemainder / 60);

  const secondsRemainder = Math.floor(timeInSeconds % 60);

  let result =
    hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}` : `${minutes}`;

  result = `${result}:${String(secondsRemainder).padStart(2, "0")}`;

  return result;
};
