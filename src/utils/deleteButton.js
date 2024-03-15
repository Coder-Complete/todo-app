export const DeleteButton = {
  classNames: {
    DELETE_BUTTON: "delete-button",
    DELETE_IMAGE: "delete-image",
  },
  image: {
    path: "images/icon-cross.svg",
    altText: "",
  },
  clicked(event) {
    return (
      event.target.classList.contains(this.classNames.DELETE_BUTTON) ||
      event.target.classList.contains(this.classNames.DELETE_IMAGE)
    );
  },
};
