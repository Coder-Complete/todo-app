// Utility functions related to UI interactions
export const deleteButton = {
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
