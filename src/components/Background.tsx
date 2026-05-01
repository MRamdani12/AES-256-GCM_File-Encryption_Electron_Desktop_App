function Background({
  color,
  animationDuration,
  className,
  alternate,
}: {
  color: string;
  animationDuration: string;
  className?: string;
  alternate?: boolean;
}) {
  return (
    <div
      className={`${className} absolute -z-1 flex ${alternate ? "animate-marquee-alternate right-0" : "animate-marquee left-0"} items-end justify-end overflow-hidden`}
    >
      <svg
        width="2926"
        height="556"
        viewBox="0 0 2926 556"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDuration: animationDuration }}
      >
        <g clip-path="url(#clip0_2931_2)">
          <path
            d="M2926 553.192V45.7888C2926 45.7641 2925.98 45.7429 2925.96 45.7386L2832.46 29.0182C2666.14 -0.726784 2496.54 -7.64575 2328.34 8.45264C2239.5 16.9562 2151.38 31.8503 2064.68 53.0192L1947.77 81.5625C1873.49 99.698 1798 112.439 1721.88 119.686L1649.6 126.567C1526.03 138.332 1401.36 129.894 1280.49 101.584C1166.4 74.8601 1048.87 65.8347 932.035 74.8245L714.159 91.5883C475.156 109.978 234.753 94.5492 0.0613338 45.7589C0.0296937 45.7523 0 45.7764 0 45.8087V553.192C0 554.297 0.895486 555.192 2.00006 555.192H2924C2925.1 555.192 2926 554.297 2926 553.192Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_2931_2">
            <rect width="2926" height="556" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <svg
        width="2926"
        height="556"
        viewBox="0 0 2926 556"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animationDuration: animationDuration }}
        className="-ml-px"
      >
        <g clip-path="url(#clip0_2931_2)">
          <path
            d="M2926 553.192V45.7888C2926 45.7641 2925.98 45.7429 2925.96 45.7386L2832.46 29.0182C2666.14 -0.726784 2496.54 -7.64575 2328.34 8.45264C2239.5 16.9562 2151.38 31.8503 2064.68 53.0192L1947.77 81.5625C1873.49 99.698 1798 112.439 1721.88 119.686L1649.6 126.567C1526.03 138.332 1401.36 129.894 1280.49 101.584C1166.4 74.8601 1048.87 65.8347 932.035 74.8245L714.159 91.5883C475.156 109.978 234.753 94.5492 0.0613338 45.7589C0.0296937 45.7523 0 45.7764 0 45.8087V553.192C0 554.297 0.895486 555.192 2.00006 555.192H2924C2925.1 555.192 2926 554.297 2926 553.192Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_2931_2">
            <rect width="2926" height="556" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default Background;
