const formatDate = (date: Date): string => {
  const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  return formattedDate;
};

export default formatDate;
