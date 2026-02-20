import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import apiClient from "./axios";

jest.mock("./axios", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

const mockTmdbResponse = {
  data: {
    results: [
      {
        id: 100,
        title: "Recruiter Demo Title",
        overview: "A mocked response used to validate rendering.",
        backdrop_path: null,
        poster_path: null,
        vote_average: 8.4,
        genre_ids: [878, 18],
        release_date: "2024-03-01",
        original_language: "en",
      },
    ],
  },
};

beforeEach(() => {
  window.localStorage.clear();
  apiClient.get.mockImplementation(() => Promise.resolve(mockTmdbResponse));
});

test("renders upgraded dashboard controls and categories", async () => {
  render(<App />);

  expect(screen.getByText(/Discover/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Add Custom Title/i })).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/Netflix Originals/i)).toBeInTheDocument();
  });
});
