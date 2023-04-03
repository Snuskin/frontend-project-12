import errorImg from "./../images/err404.jpg";

const BuildNotFoundPage = () => {
  return (
    <>
      <div
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          style={{ marginTop: "5vh", width: "30vw", height: "50vh" }}
          src={errorImg}
          alt=""
        ></img>

        <h1 style={{ fontSize: "10rem" }}>404</h1>
        <h2 style={{ fontSize: "3rem" }}>Страница не найдена</h2>
      </div>
    </>
  );
};
export const NotFound = () => BuildNotFoundPage();
