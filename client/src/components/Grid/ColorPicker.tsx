import classNames from "classnames";

const colorsData = [
  [
    {
      label: "black",
      colorCode: "rgb(0, 0, 0)",
    },
    {
      label: "dark gray 4",
      colorCode: "rgb(67, 67, 67)",
    },
    {
      label: "dark gray 3",
      colorCode: "rgb(102, 102, 102)",
    },
    {
      label: "dark gray 2",
      colorCode: "rgb(153, 153, 153)",
    },
    {
      label: "dark gray 1",
      colorCode: "rgb(183, 183, 183)",
    },
    {
      label: "gray",
      colorCode: "rgb(204, 204, 204)",
    },
    {
      label: "light gray 1",
      colorCode: "rgb(217, 217, 217)",
    },
    {
      label: "light gray 2",
      colorCode: "rgb(239, 239, 239)",
    },
    {
      label: "light gray 3",
      colorCode: "rgb(243, 243, 243)",
    },
    {
      label: "white",
      colorCode: "rgb(255, 255, 255)",
    },
  ],
  [
    {
      label: "red berry",
      colorCode: "rgb(152, 0, 0)",
    },
    {
      label: "red",
      colorCode: "rgb(255, 0, 0)",
    },
    {
      label: "orange",
      colorCode: "rgb(255, 153, 0)",
    },
    {
      label: "yellow",
      colorCode: "rgb(255, 255, 0)",
    },
    {
      label: "green",
      colorCode: "rgb(0, 255, 0)",
    },
    {
      label: "cyan",
      colorCode: "rgb(0, 255, 255)",
    },
    {
      label: "cornflower blue",
      colorCode: "rgb(74, 134, 232)",
    },
    {
      label: "blue",
      colorCode: "rgb(0, 0, 255)",
    },
    {
      label: "purple",
      colorCode: "rgb(153, 0, 255)",
    },
    {
      label: "magenta",
      colorCode: "rgb(255, 0, 255)",
    },
  ],
  [
    {
      label: "light red berry 3",
      colorCode: "rgb(230, 184, 175)",
    },
    {
      label: "light red 3",
      colorCode: "rgb(244, 204, 204)",
    },
    {
      label: "light orange 3",
      colorCode: "rgb(252, 229, 205)",
    },
    {
      label: "light yellow 3",
      colorCode: "rgb(255, 242, 204)",
    },
    {
      label: "light green 3",
      colorCode: "rgb(217, 234, 211)",
    },
    {
      label: "light cyan 3",
      colorCode: "rgb(208, 224, 227)",
    },
    {
      label: "light cornflower blue 3",
      colorCode: "rgb(201, 218, 248)",
    },
    {
      label: "light blue 3",
      colorCode: "rgb(207, 226, 243)",
    },
    {
      label: "light purple 3",
      colorCode: "rgb(217, 210, 233)",
    },
    {
      label: "light magenta 3",
      colorCode: "rgb(234, 209, 220)",
    },
  ],
  [
    {
      label: "light red berry 2",
      colorCode: "rgb(221, 126, 107)",
    },
    {
      label: "light red 2",
      colorCode: "rgb(234, 153, 153)",
    },
    {
      label: "light orange 2",
      colorCode: "rgb(249, 203, 156)",
    },
    {
      label: "light yellow 2",
      colorCode: "rgb(255, 229, 153)",
    },
    {
      label: "light green 2",
      colorCode: "rgb(182, 215, 168)",
    },
    {
      label: "light cyan 2",
      colorCode: "rgb(162, 196, 201)",
    },
    {
      label: "light cornflower blue 2",
      colorCode: "rgb(164, 194, 244)",
    },
    {
      label: "light blue 2",
      colorCode: "rgb(159, 197, 232)",
    },
    {
      label: "light purple 2",
      colorCode: "rgb(180, 167, 214)",
    },
    {
      label: "light magenta 2",
      colorCode: "rgb(213, 166, 189)",
    },
  ],
  [
    {
      label: "light red berry 1",
      colorCode: "rgb(204, 65, 37)",
    },
    {
      label: "light red 1",
      colorCode: "rgb(224, 102, 102)",
    },
    {
      label: "light orange 1",
      colorCode: "rgb(246, 178, 107)",
    },
    {
      label: "light yellow 1",
      colorCode: "rgb(255, 217, 102)",
    },
    {
      label: "light green 1",
      colorCode: "rgb(147, 196, 125)",
    },
    {
      label: "light cyan 1",
      colorCode: "rgb(118, 165, 175)",
    },
    {
      label: "light cornflower blue 1",
      colorCode: "rgb(109, 158, 235)",
    },
    {
      label: "light blue 1",
      colorCode: "rgb(111, 168, 220)",
    },
    {
      label: "light purple 1",
      colorCode: "rgb(142, 124, 195)",
    },
    {
      label: "light magenta 1",
      colorCode: "rgb(194, 123, 160)",
    },
  ],
  [
    {
      label: "dark red berry 1",
      colorCode: "rgb(166, 28, 0)",
    },
    {
      label: "dark red 1",
      colorCode: "rgb(204, 0, 0)",
    },
    {
      label: "dark orange 1",
      colorCode: "rgb(230, 145, 56)",
    },
    {
      label: "dark yellow 1",
      colorCode: "rgb(241, 194, 50)",
    },
    {
      label: "dark green 1",
      colorCode: "rgb(106, 168, 79)",
    },
    {
      label: "dark cyan 1",
      colorCode: "rgb(69, 129, 142)",
    },
    {
      label: "dark cornflower blue 1",
      colorCode: "rgb(60, 120, 216)",
    },
    {
      label: "dark blue 1",
      colorCode: "rgb(61, 133, 198)",
    },
    {
      label: "dark purple 1",
      colorCode: "rgb(103, 78, 167)",
    },
    {
      label: "dark magenta 1",
      colorCode: "rgb(166, 77, 121)",
    },
  ],
  [
    {
      label: "dark red berry 2",
      colorCode: "rgb(133, 32, 12)",
    },
    {
      label: "dark red 2",
      colorCode: "rgb(153, 0, 0)",
    },
    {
      label: "dark orange 2",
      colorCode: "rgb(180, 95, 6)",
    },
    {
      label: "dark yellow 2",
      colorCode: "rgb(191, 144, 0)",
    },
    {
      label: "dark green 2",
      colorCode: "rgb(56, 118, 29)",
    },
    {
      label: "dark cyan 2",
      colorCode: "rgb(19, 79, 92)",
    },
    {
      label: "dark cornflower blue 2",
      colorCode: "rgb(17, 85, 204)",
    },
    {
      label: "dark blue 2",
      colorCode: "rgb(11, 83, 148)",
    },
    {
      label: "dark purple 2",
      colorCode: "rgb(53, 28, 117)",
    },
    {
      label: "dark magenta 2",
      colorCode: "rgb(116, 27, 71)",
    },
  ],
  [
    {
      label: "dark red berry 3",
      colorCode: "rgb(91, 15, 0)",
    },
    {
      label: "dark red 3",
      colorCode: "rgb(102, 0, 0)",
    },
    {
      label: "dark orange 3",
      colorCode: "rgb(120, 63, 4)",
    },
    {
      label: "dark yellow 3",
      colorCode: "rgb(127, 96, 0)",
    },
    {
      label: "dark green 3",
      colorCode: "rgb(39, 78, 19)",
    },
    {
      label: "dark cyan 3",
      colorCode: "rgb(12, 52, 61)",
    },
    {
      label: "dark cornflower blue 3",
      colorCode: "rgb(28, 69, 135)",
    },
    {
      label: "dark blue 3",
      colorCode: "rgb(7, 55, 99)",
    },
    {
      label: "dark purple 3",
      colorCode: "rgb(32, 18, 77)",
    },
    {
      label: "dark magenta 3",
      colorCode: "rgb(76, 17, 48)",
    },
  ],
] as const;

const lightColors = new Set([
  "light gray 2",
  "light gray 1",
  "light gray 3",
  "white",
]);

type IColorPickerProps = {
  onClick: (colorCode: string) => void;
};

const ColorPicker = ({ onClick }: IColorPickerProps) => {
  return (
    <div className="flex gap-1 flex-col w-fit shadow-[0_2px_6px_2px_rgba(60,64,67,.15)] border border-transparent rounded bg-white z-30 p-4">
      {colorsData.map((colors, index) => {
        return (
          <div key={index} className="flex gap-1">
            {colors.map(({ colorCode, label }) => {
              return (
                <button
                  key={label}
                  title={label}
                  className={classNames("w-5 h-5 rounded-full", {
                    "border border-[#dadce0]": lightColors.has(label),
                  })}
                  style={{ backgroundColor: colorCode }}
                  onClick={() => onClick(colorCode)}
                ></button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default ColorPicker;
