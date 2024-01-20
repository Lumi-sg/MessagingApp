export type User = {
	_id?: string;
	username: string;
	friends: User[];
	statusMessage: string;
	age: number;
	country: string;
};



export default User;
