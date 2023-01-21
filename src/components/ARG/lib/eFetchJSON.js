export const eFetchJSON = async (url) => {
    let res = await fetch(url);

    if (res.status !== 200) {
        return null;
    }

    let json = await res.json();
    return json;
}