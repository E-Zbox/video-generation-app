import styled from "styled-components";

interface IVideoThumbnail {
  $bgImg: string;
}

export const MainAIGeneratedVideo = styled.main`
  ${({ theme: { brown01, blue05 } }) => `
    height: fit-content;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    position: relative;
    padding: var(--seven-px);
    border-radius: 5px;
    padding: var(--seven-px);
    background-color: #ffffff13;
    box-shadow: 1px 1px 3px #9a9a9b45;
    overflow: hidden;
    margin-bottom: calc(var(--ten-px) * 1.5);

    &:last-of-type {
        margin-bottom: 0px;
    }
  `}
`;

export const VideoThumbnail = styled.div<IVideoThumbnail>`
  ${({ $bgImg, theme: { blue05 } }) => `
  --mediaTrayVideoSize: 100px;
  height: var(--mediaTrayVideoSize);
  width: var(--mediaTrayVideoSize);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  align-self: flex-start;
  border-radius: 5px;
  overflow: hidden;
  background-image: url(${$bgImg});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: var(--ten-px);
  border: 1px solid #9a9a9a89;
  box-shadow: 1px 1px 3px 0px #8882;
  transition: 350ms ease-out;

  span {
    color: white;
    font-size: 0.9rem;
    border-radius: 3px;
    margin-left: var(--three-px);
    margin-bottom: var(--three-px);
    padding: var(--three-px) var(--seven-px);
    background-color: ${blue05}89;
  }
    `}
`;

export const NonVideoThumbnail = styled.div`
  height: 100%;
  min-width: 0px;
  flex-basis: 0;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
`;

export const ProcessingText = styled.h4`
  color: #ededed;
  font-style: italic;
  font-size: 0.95rem;
  font-weight: 400;
  margin-bottom: var(--seven-px);
`;

export const StatusButton = styled.button`
  ${({ theme: { green01 } }) => `
        color: ${green01};
        font-size: 1rem;
        border: none;
        outline: none;
        border-radius: 5px;
        padding: var(--seven-px);
        background: transparent;
        border: 1px solid ${green01};

        &:hover {
            color: #fefefe;
            background-color: ${green01};
        }
    `}
`;

export const VideoNameText = styled.h4`
  ${({ theme: { purple01 } }) => `
        color: ${purple01};
        font-family: Nunito;
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: var(--seven-px);
    `}
`;

export const OtherDownloads = styled.div`
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  overflow-x: scroll;
  background-color: #fefefe0a;
`;

export const DownloadFile = styled.button`
  ${({ theme: { brown01 } }) => `
    border: none;
    outline: none;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    font-family: Poppins;
    font-size: 0.8rem;
    font-weight: 200;
    border-radius: 5px;
    color: ${brown01};
    opacity: 0.7;
    white-space: nowrap;
    padding: var(--three-px);
    padding-left: calc(var(--three-px) * 2);
    margin-right: var(--seven-px);
    background-color: transparent;

    &:hover {
        opacity: 1;
        font-weight: 700;
        background-color: #7772;
    }

    &:active {
        scale: 0.95;
    }

    img {
        margin-left: var(--three-px);
    }
  `}
`;
