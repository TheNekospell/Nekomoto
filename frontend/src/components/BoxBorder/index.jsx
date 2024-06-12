export default function BoxBorder({color = '#C3C0A4'}) {
  return (
    <>
      <div
        style={{
          width: "calc(100% - 12px)",
          height: 2,
          left: 6,
          top: 0,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: "calc(100% - 12px)",
          height: 2,
          left: 6,
          bottom: 0,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: 4,
          left: 6,
          top: 2,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: 4,
          right: 6,
          top: 2,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 6,
          height: 2,
          left: 0,
          top: 4,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 6,
          height: 2,
          right: 0,
          top: 4,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 6,
          height: 2,
          left: 0,
          bottom: 4,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 6,
          height: 2,
          right: 0,
          bottom: 4,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: "calc(100% - 12px)",
          left: 0,
          top: 6,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: "calc(100% - 12px)",
          right: 0,
          top: 6,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: 4,
          left: 6,
          bottom: 2,
          position: "absolute",
          background: color,
        }}
      />
      <div
        style={{
          width: 2,
          height: 4,
          right: 6,
          bottom: 2,
          position: "absolute",
          background: color,
        }}
      />
    </>
  );
}
