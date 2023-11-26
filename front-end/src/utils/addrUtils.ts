const shortenAddr = (address: string | undefined | null) => {
  const maxLength = 10;
  if (address != undefined) {
    const start = address.substring(0, maxLength / 2);
    const end = address.substring(address.length - maxLength / 2);
    address = `${start}...${end}`;
    return address;
  }
};

export { shortenAddr };
