import React, { ComponentType, PropsWithChildren } from "react";
import ErrorImage from "@/assets/error.svg";
import { Button } from "./components/ui/button";
import { getReasonPhrase } from "http-status-codes";
import { Icons } from "./components/ui/icons";
import { useTheme } from "./components/theme-provider";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryState {
  hasError: boolean;
  errorCode?: number;
  errorMessage?: string;
}

interface ThemedComponentProps {
  theme: string;
}

interface ErrorBoundaryProps extends ThemedComponentProps {
  errorCode?: number;
}

function withTheme(
  Component: ComponentType<ThemedComponentProps & { errorCode?: number }>,
) {
  const ThemedComponent = (
    props: PropsWithChildren<ThemedComponentProps & { errorCode?: number }>,
  ) => {
    const themeContext = useTheme();
    const theme = themeContext.theme;

    return <Component {...props} theme={theme} />;
  };

  ThemedComponent.displayName = `WithTheme(${getDisplayName(Component)})`;

  return ThemedComponent;
}

function getDisplayName(Component: ComponentType<any>) {
  return Component.displayName || Component.name || "Component";
}

class ErrorBoundary extends React.Component<
  PropsWithChildren<ErrorBoundaryProps>,
  ErrorBoundaryState & { error?: Error; info?: React.ErrorInfo }
> {
  constructor(props: PropsWithChildren<ThemedComponentProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.log(error);
    // Update state so the next render will show the fallback UI.
    return {
      hasError: true,
      errorCode: error.response?.status,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // TODO: We will also log the error later on in IT Admin panel
    console.error(error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorBoundaryFallback
          errorCode={this.state.errorCode}
          errorMessage={this.state.errorMessage}
          error={this.state.error}
          info={this.state.info}
          theme={this.props.theme}
        />
      );
    }

    return this.props.children;
  }
}

const ErrorBoundaryFallback: React.FC<{
  errorCode?: number;
  errorMessage?: string;
  error?: Error;
  info?: React.ErrorInfo;
  theme: string;
}> = ({ errorCode, errorMessage, error, info, theme }) => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("auth/login");
  };

  const errorMessage_ = errorCode
    ? getReasonPhrase(errorCode)
    : errorMessage
      ? errorMessage
      : "An error occurred";

  let ErrorIcon;

  switch (errorCode) {
    case 403:
      ErrorIcon = Icons.UnauthorizedAccessIcon;
      break;
    case 500:
      ErrorIcon = Icons.ServerErrorIcon;
      break;
    case 404:
      ErrorIcon = Icons.NotFoundIcon;
      break;
    default:
      ErrorIcon = Icons.OtherErrorIcon;
  }

  return (
    <div className=" shrink min-h-screen relative overflow-hidden bg-[#078ECE] lg:bg-transparent">
      <div className="shrink min-h-screen flex items-center justify-center z-0">
        <img
          src={ErrorImage}
          alt="error page"
          className="object-cover h-dvh hidden lg:block"
        />
      </div>
      <div className="z-20 min-h-screen flex items-center justify-center flex-col absolute top-0 left-0 w-full">
        <div className="flex flex-col p-3 mb-10 md:mb-0">
          <h1 className="text-white text-6xl md:text-8xl font-bold">
            {errorCode}
          </h1>
          <h1 className="text-white text-xl md:text-2xl max-w-lg word-wrap">
            {errorMessage_}
          </h1>
          <details className="text-white max-w-lg word-wrap">
            {error && error.toString()}
            <br />
            {info && info.componentStack}
          </details>
        </div>
        <div>
          <ErrorIcon className="text-red-500 w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div className="mt-20">
          <Button className="bg-white text-primary" onClick={navigateToHome}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("auth/login");
  };

  return (
    <>
      <div className="min-h-screen relative overflow-hidden bg-[#078ECE] lg:bg-transparent">
        <div className="min-h-screen flex items-center justify-center z-0">
          <img
            src={ErrorImage}
            alt="error page"
            className="object-cover h-dvh hidden lg:block"
          />
        </div>
        <div className="z-20 min-h-screen flex items-center justify-center flex-col absolute top-0 left-0 w-full">
          <div className="flex flex-col p-3 mb-10 md:mb-0 items-center justify-center">
            <h1 className="text-white font-bold text-6xl md:text-8xl">404</h1>
            <h1 className="text-white text-xl md:text-2xl max-w-lg word-wrap">
              Page Not Found
            </h1>
          </div>
          <div>
            <Icons.NotFoundIcon className="text-red-500 w-24 md:w-32 h-24 md:h-32" />
          </div>
          <div className="mt-20">
            <Button className="bg-white text-primary" onClick={navigateToHome}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withTheme(ErrorBoundary);
export { NotFoundPage };
