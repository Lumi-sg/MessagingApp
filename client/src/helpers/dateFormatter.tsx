import { format } from "date-fns";

export const dateFormatter = (date: string) => {
	const formattedDate = format(new Date(date), "MMM d, h:mm a");

	return formattedDate;
};
