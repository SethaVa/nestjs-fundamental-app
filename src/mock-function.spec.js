import { CreateSongDto } from './songs/dto/create-song.dto';

describe('Mock Function Examples', () => {
    // 1. create an empty mock function
    // 2. The function configure return a value of 3
    // 3. Tracking the calls to mock functions is achievable
    it('should create a basic mock function', () => {
        const mockFn = jest.fn();
        mockFn.mockReturnValue(3);
        console.log(mockFn());
        expect(mockFn()).toBe(3);
        expect(mockFn.mock.calls.length).toBe(2);
        expect(mockFn).toHaveBeenCalledWith(mockFn);
    });

    it('should create a mock function with argument', () => {
        const createSongMock = jest.fn((createSongDto) => ({
            it: 1,
            title: createSongDto.title,
        }));
        console.log(createSongMock);
        expect(createSongMock).toHaveBeenCalled();
        expect(createSongMock({ title: 'Lover' })).toEqual({ id: 1, title: 'Lover' });
    });

    it('create mock function using mockImplementation', () => {
        const mockFn = jest.fn();
        mockFn.mockImplementation(() => {
            console.log('Mock function called');
        });

        mockFn();
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(1);
        expect(mockFn).toHaveBeenCalledWith();
    })

    it('create mock function with promise', () => {
        const mockFetchSongs = jest.fn();
        mockFetchSongs.mockResolvedValue({ id: 1, title: 'Dancing Feat'});

        mockFetchSongs().then((result) => {
            console.log(result);
        });

        expect(mockFetchSongs).toHaveBeenCalled();
        expect(mockFetchSongs()).resolves.toBe({ id: 1, title: 'Dancing Feat'});
    })
});

const songRepository = {
    create: (createSongDto) => {
        // Original method implement
    },
}

describe('SpyOn Demo', () => {
    it('should spyon the existing object', () => {
        const spy = jest.spyOn(songRepository, 'create');

        // call method
        songRepository.create({ id: 1, title: 'Lover' });

        // Assertions
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith({ id: 1, title: 'Lover' });
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);

        // Restore the original method
        spy.mockRestore();
    })
})
