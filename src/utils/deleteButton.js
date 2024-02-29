export const deleteButton = {
  image: { path: "./images/icon-cross.svg", altText: "" },
  classNames: {
    BUTTON: "delete-button",
    IMAGE: "delete-image",
  },
  clicked(event) {
    return (
      event.target.classList.contains(this.classNames.BUTTON) ||
      event.target.classList.contains(this.classNames.IMAGE)
    );
  },
};
