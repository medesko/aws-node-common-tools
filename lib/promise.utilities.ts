// IndexedValue<I>
export interface IndexedValue<I> {
	value: I;
	index: number;
}

// Result<O> wraps a Promise's result: either of successfull result of
// type O or an error.
export interface Result<O> {
	result?: O;
	error?: any;
}

export interface Results<O> {
	succeeds: O[];
	failures: any[];
}

export function GroupResults<O>(results: Result<O>[]): Results<O> {
	return results.reduce(
		(acc: { succeeds: O[]; failures: any[] }, result: Result<O>) => {
			if (result.error != undefined)
				acc.failures = acc.failures.concat(result.error);
			else if (result.result != undefined)
				acc.succeeds = acc.succeeds.concat(result.result);

			return acc;
		},
		{ succeeds: [], failures: [] }
	);
}

// IndexedResult<O> extends Result<O> and adds the index of the input.
export interface IndexedResult<O> extends Result<O> {
	index: number;
}

// export function SplitIntoChunks<I>(inputs: I[], size: number): I[][] {
//   let chunks: I[][] = [];

//   for (let index = 0; index < inputs.length; index += size)
//     chunks = chunks.concat([inputs.slice(index, index + size)]);

//   return chunks;
// }

export function* Generator<I>(args: I[]) {
	for (const index in args) yield args[index];
}

export function* IndexedGenerator<I>(args: I[]) {
	for (let index = 0; index < args.length; index++)
		yield {
			index: index,
			value: args[index]
		};
}

export function* Chunker<I>(inputs: I[], size: number) {
	for (let index = 0; index < inputs.length; index += size)
		yield inputs.slice(index, index + size);
}

// // Oneaftertheother<I, O> executes job on each input one after the other.
// //
// // job(inputs[n+1]) will be started when job(inputs[n]) ends.
// //
// // The whole process should last as long as the sum of all the jobs duration.
// //
// // Outputs are returned in the order of inputs.
// export function OneAfterTheOther<I, O>(
//   job: (input: I) => Promise<O>,
//   inputs: I[]): Promise<Result<O>[]> {

//   let generator = Generator<I>(inputs);

//   let task = (acc: Result<O>[]): Promise<Result<O>[]> => {
//     let input = generator.next();

//     if (input == undefined || input.done)
//       return Promise.resolve(acc);

//     return job(input.value)
//       .then((result: O) => {
//         return task(acc.concat({ result: result }));
//       })
//       .catch((err: any) => {
//         return task(acc.concat({ error: err }));
//       });
//   };

//   return task([]);
// }

// Parallelizing<I, O> executes job on all inputs at the same
// time. Each of them is wrapped into a Result<O> to give a chance to
// all task to end (Promise.all would end all jobs otherwise).
//
// The whole process should last as much as the longest input execution.
//
// Outputs are returned in the order of inputs.
export function Parallelizing<I, O>(
	job: (input: I) => Promise<O>,
	inputs: I[]
): Promise<Result<O>[]> {
	return Promise.all(
		inputs.map((input: I) => {
			return job(input)
				.then((result: O) => {
					return { result: result };
				})
				.catch((err: any) => {
					return { error: err };
				});
		})
	);
}

export function Parallelize<T>(...jobs: Promise<T>[]): Promise<Result<T>[]> {
	return Promise.all(
		jobs.map((job: Promise<T>) => {
			return job
				.then((result: any) => {
					return { result: result };
				})
				.catch((err: any) => {
					return { error: err };
				});
		})
	);
}

// ParallelizingIntoChuncks<I, O> behaves as Parallelizing<I, O> but
// splits all the inputs into smaller chunks of inputs. It avoids to
// create too many Promises at the same time.
//
// The whole process should last as long as the sum of all
// parallelized execution of chunks of inputs.
//
// Parallelizing(chunks[n+1]) will be started when Parallelizing(chunks[n]) ends.
//
// Outputs are returned in the order of inputs.
export function ParallelizingIntoChuncks<I, O>(
	job: (input: I) => Promise<O>,
	inputs: I[],
	size: number
): Promise<Result<O>[]> {
	const chunker = Chunker<I>(inputs, size);

	const task = (acc: Result<O>[]): Promise<Result<O>[]> => {
		const chunk: IteratorResult<I[]> = chunker.next();

		if (chunk == undefined || chunk.done) return Promise.resolve(acc);

		return Parallelizing<I, O>(job, chunk.value)
			.then((results: Result<O>[]) => {
				return task(acc.concat(results));
			})
			.catch((err: any) => {
				throw err;
			});
	};

	return task([]);
}

// // Temporalparallelizingintochunks<I, O> behaves as
// // ParallelizingIntoChuncks<I, O> but all chunks will at least last
// // for duration.
// //
// // The whole process should last as long as the sum of all
// // parallelized execution of chunks of inputs
// //     OR
// // duration * inputs.length / size ms.
// //
// // Parallelizing(chunks[n+1]) will be started when Parallelizing(chunks[n]) ends.
// //
// // Outputs are returned in the order of inputs.
// export function TemporalParallelizingIntoChunks<I, O>(
//   duration: time.Duration,
//   job: (input: I) => Promise<O>,
//   inputs: I[],
//   size: number): Promise<Result<O>[]> {

//   if (duration <= 0)
//     return Promise.reject(new Error(
//       'TemporalParallelizingIntoChunks: duration must be greater than 0'));

//   let chunker = Chunker<I>(inputs, size);

//   let task = (acc: Result<O>[]): Promise<Result<O>[]> => {
//     let chunk = chunker.next();

//     if (chunk == undefined || chunk.done)
//       return Promise.resolve(acc);

//     return Promise.all([
//       new Promise<void>((resolve) => {
//         setTimeout(() => { resolve(); }, duration / 1e6);
//       }),

//       Parallelizing<I, O>(job, chunk.value)
//     ])
//       .then((results: any[]) => {
//         return task(acc.concat(results[1]));
//       })
//       .catch((err: any) => { throw err; });
//   };

//   return task([]);
// }

// WorkingPool<I, O> starts workers to execute all the inputs. Put
// another way, all the inputs will be dispatched among all the
// workers.
//
// Each worker triggers an input, executes the job on it and finally
// passes it to cb. Then it starts all over: workers continue until
// all inputs are executed.
//
// When there is no more jobs to execute, workers end.
// When there is no more workers, WorkingPool<I, O> ends.
//
// It can help to execute a job on inputs and to be sure that there
// is at most size jobs executed simultaneously.
//
// Outputs are NOT returned in the order of inputs.
export function WorkingPool<I, O>(
	size: number,
	job: (input: I) => Promise<O>,
	generator: IterableIterator<IndexedValue<I>>,
	cb: (err: any | null, result?: IndexedResult<O>) => void
): void {
	if (size <= 0)
		return cb(new Error('WorkingPoolQueue: size must be greater than 0'));

	let workers = 0;
	const task = (resolve: () => void): Promise<void> => {
		const input = generator.next();

		if (input.done) {
			workers--;
			resolve();

			if (workers == 0) cb(null);

			return Promise.resolve();
		}

		return job(input.value.value)
			.then((result: O) => {
				cb(null, { index: input.value.index, result: result });

				return task(resolve);
			})
			.catch((err: any) => {
				cb(null, { index: input.value.index, error: err });

				return task(resolve);
			});
	};

	for (let index = 0; index < size; index++)
		new Promise<void>(resolve => {
			workers++;

			task(resolve);
		});
}

// export function WorkingPool2<I, O>(
//   size: number,
//   source: () => Promise<I | null>,
//   job: (input: I) => Promise<O>,
//   cb: (err: any | null, result?: Result<O>) => void): void {

//   if (size <= 0)
//     return cb(new Error('WorkingPoolQueue: size must be greater than 0'));

//   let workers = 0;
//   let finished = false;
//   let done = (resolve: () => void): Promise<void> => {
//     resolve();

//     workers--;

//     if (workers == 0)
//       cb(null);

//     return Promise.resolve();
//   };

//   let task = (resolve: () => void): Promise<void> => {
//     if (finished)
//       return done(resolve);

//     return source()
//       .then((input: I | null) => {
//         if (input == null) {
//           finished = true;

//           return done(resolve);
//         }

//         else
//           return job(input)
//             .then((result: O) => {
//               cb(null, result);

//               return task(resolve);
//             })
//             .catch((err: any) => {
//               cb(err);

//               return task(resolve);
//             });
//       })
//   };

//   for (let index = 0; index < size; index++)
//     new Promise<void>((resolve) => {
//       workers++;

//       task(resolve);
//     });
// }

// WorkingPoolQueue<I, O> behaves as WorkingPool but waits for all the
// inputs to be executed and puts the results back in the order.
export function WorkingPoolQueue<I, O>(
	size: number,
	job: (input: I) => Promise<O>,
	inputs: I[]
): Promise<Result<O>[]> {
	return new Promise<Result<O>[]>((resolve, reject) => {
		let results: Result<O>[] = [];

		results = results.fill({}, 0, inputs.length);

		const cb = (err: any | null, result?: IndexedResult<O>) => {
			if (err != null) reject(err);
			else if (result == undefined) resolve(results);
			else
				results[result.index] = {
					result: result.result,
					error: result.error
				};
		};

		WorkingPool<I, O>(size, job, IndexedGenerator<I>(inputs), cb);
	});
}

export function Cascade<I, O>(
	job: (input: I, index?: number) => Promise<O>,
	inputs: I[]
): Promise<Result<O>[]> {
	return inputs.reduce((acc: Promise<Result<O>[]>, input: I, index: number) => {
		let previous: Result<O>[];

		return acc
			.then((results: Result<O>[]) => {
				previous = results;

				return job(input, index);
			})
			.then((result: O) => {
				return previous.concat({ result: result });
			})
			.catch((err: any) => {
				return previous.concat({ error: err });
			});
	}, Promise.resolve([]));
}
