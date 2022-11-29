// let errors = new Array();

const jsonValidator = (grammar, validating, errors) => {
  const grammarArray = Object.keys(grammar).filter(
    (value) => !Object.keys(validating).includes(value)
  );

  const extraEntries = Object.keys(validating).filter(
    (value) => !Object.keys(grammar).includes(value)
  );

  extraEntries.map((en) => {
    errors.push(`"${en}" is invalid key in the JSON`);
  });

  grammarArray.map((en) => {
    if (grammar[en].req === "mandatory") {
      errors.push(
        `"${en}" is a mandatory field! Please add the field with ${grammar[en].typeof} type`
      );
    }
  });

  const keys = Object.keys(grammar);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // If optional key is not present
    if (typeof validating[key] === "undefined") {
      continue;
    }

    // Handling nested objects recursively
    if (
      typeof validating[key] === "object" &&
      grammar[key].typeof === "object"
    ) {
      jsonValidator(grammar[key].k, validating[key]);
      continue;
    }

    if (typeof validating[key] !== grammar[key].typeof) {
      errors.push(
        ` "${key}" has an invalid type of '${typeof validating[
          key
        ]}'. Expected type of '${grammar[key].typeof}' `
      );
    }
  }

  if (errors.length > 0) return true;

  return false;
};

export default jsonValidator;
