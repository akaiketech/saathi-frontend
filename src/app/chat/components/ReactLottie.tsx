import { FC } from "react";
import Lottie, { LottieProps } from "react-lottie";

interface ReactLottieProps extends LottieProps {}

const ReactLottie: FC<ReactLottieProps> = (props) => {
  return <Lottie {...props} />;
};

export { ReactLottie };
