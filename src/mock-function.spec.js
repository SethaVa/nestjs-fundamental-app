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
});
