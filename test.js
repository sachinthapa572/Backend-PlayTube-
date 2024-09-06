try {
	throw new Error('Whoops!');
} catch (e) {
	console.log(e);
	//  console.error(`${e.name}: ${e.message}`);
}
