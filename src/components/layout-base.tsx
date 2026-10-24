export const LayoutBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="relative box-border flex min-h-dvh w-full flex-col rounded-b-lg bg-light main-background lg:p-2.25 book:bg-sepia dark:bg-dark">
        <main className="relative flex w-full grow flex-col">{children} </main>
      </div>
      <div
        id="padding"
        className="pointer-events-none fixed top-0 left-0 z-99 hidden h-dvh w-full p-2 lg:block"
      >
        <div className="h-full w-full border border-[#121212] dark:border-[#f7f7f7]"></div>
      </div>
      <div
        id="frame"
        className="background-frame pointer-events-none fixed top-0 right-0 z-100 hidden h-dvh w-full lg:block"
      ></div>
    </>
  );
};
