import * as React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const YouTubeIcon: React.FC<IconProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M549.655 124.083c-6.281-23.65-24.787-42.256-48.332-48.543C458.383 64 288 64 288 64s-170.383 0-213.323 11.54c-23.545 6.287-42.05 24.893-48.331 48.543C16 167.055 16 256.055 16 256.055s0 89 10.346 131.972c6.281 23.65 24.786 42.256 48.331 48.543C117.617 448 288 448 288 448s170.383 0 213.323-11.54c23.545-6.287 42.05-24.893 48.332-48.543C560 345.055 560 256.055 560 256.055s0-89-10.345-131.972zM232 338.055v-164l142 82-142 82z" />
    </svg>
  );
};

export default YouTubeIcon;
