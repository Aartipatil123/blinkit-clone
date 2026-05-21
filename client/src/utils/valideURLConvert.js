export const valideURLConvert = (name) => {

    if (!name) return "";

    const url = name
        .toString()
        .trim()
        .toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll(",", "-")
        .replaceAll("&", "-");

    return url;
};