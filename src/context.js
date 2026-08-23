// Your "Context" tab should look like this
InnerSelf("context");
const modifier = (text) => {
  // Any other context modifier scripts can go here
  text = StoryCardExtensionContext(text);
  return { text, stop };
};
modifier(text);
