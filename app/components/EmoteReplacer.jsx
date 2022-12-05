function EmoteReplacer(props) {
    const { input, arrayEmotes } = props;
  
    // Split the input string into an array of words
    const inputWords = input.split(' ');
  
    // Loop through each word in the input array and check if it matches an emote name
    const outputWords = inputWords.map(word => {
      // Loop through each emote and check if the current word matches the emote name
      for (const emote of arrayEmotes) {
        if (word === emote.name) {
          // If the current word matches the emote name, return the HTML image tag
          return `<img src="${emote.url}" alt="${emote.name}" />`;
        }
      }
  
      // If the current word does not match any emote name, return the original word
      return word;
    });
  
    // Join the output words back into a single string
    const output = outputWords.join(' ');
  
    return <span dangerouslySetInnerHTML={{ __html: output }} />;
}