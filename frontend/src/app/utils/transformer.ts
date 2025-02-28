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

export const readFileAsBase64 = async (file: Blob): Promise<any> => {
  return new Promise((resolver, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolver(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export const download = (url: string) => {
  const link = document.createElement("a");

  link.href = url;

  link.setAttribute("download", "");

  link.click();
};
