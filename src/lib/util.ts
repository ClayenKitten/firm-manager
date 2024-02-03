export function dateToLocalISO(date: Date): `${number}-${number}-${number}` {
    let split = date.toLocaleDateString("en-GB").split("/");
    return `${split[2]}-${split[1]}-${split[0]}` as `${number}-${number}-${number}`;
}
