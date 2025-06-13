// insert the data

app.get('/', async (req, res) => {
	const data = [
		{
			username: 'admin',
			email: 'admin@example.com',
			fullName: 'User 1',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user2',
			email: 'user2@example.com',
			fullName: 'User 2',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user3',
			email: 'user3@example.com',
			fullName: 'User 3',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user4',
			email: 'user4@example.com',
			fullName: 'User 4',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user5',
			email: 'user5@example.com',
			fullName: 'User 5',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user6',
			email: 'user6@example.com',
			fullName: 'User 6',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user7',
			email: 'user7@example.com',
			fullName: 'User 7',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user8',
			email: 'user8@example.com',
			fullName: 'User 8',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user9',
			email: 'user9@example.com',
			fullName: 'User 9',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user10',
			email: 'user10@example.com',
			fullName: 'User 10',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user11',
			email: 'user11@example.com',
			fullName: 'User 11',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user12',
			email: 'user12@example.com',
			fullName: 'User 12',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user13',
			email: 'user13@example.com',
			fullName: 'User 13',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user14',
			email: 'user14@example.com',
			fullName: 'User 14',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user15',
			email: 'user15@example.com',
			fullName: 'User 15',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user16',
			email: 'user16@example.com',
			fullName: 'User 16',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user17',
			email: 'user17@example.com',
			fullName: 'User 17',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user18',
			email: 'user18@example.com',
			fullName: 'User 18',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user19',
			email: 'user19@example.com',
			fullName: 'User 19',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
		{
			username: 'user20',
			email: 'user20@example.com',
			fullName: 'User 20',
			avatar:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938729/grsdhccepkvafgsu9wx8.jpg',
			coverImage:
				'http://res.cloudinary.com/df93dsfvp/image/upload/v1727938731/ockgmjlx11sjedpfpi7u.jpg',
			password: 'admin',
			refreshToken: null,
			watchHistory: [],
		},
	];

	const hashedUsers = await Promise.all(
		data.map(async (user) => {
			const newUser = new User(user); // Create Mongoose user instance
			await newUser.save(); // `save` will trigger the `pre('save')` hook
			return newUser;
		})
	);

	console.log(hashedUsers);
	res.send(hashedUsers);
});
