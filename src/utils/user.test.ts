import {
  getIsCurrentUserFollowingProfile,
  updateCountForPosts,
  updateFollowCache,
  updateUserProfileFollowStatus,
} from "./user";

describe("User utilities", () => {
  describe("getIsCurrentUserFollowingProfile", () => {
    it("should return true if user is following profile", () => {
      const currentUser = {
        id: 1,
        initiatedFollows: [{ targetUserId: 2 }],
      } as any;
      expect(getIsCurrentUserFollowingProfile(currentUser, 2)).toBe(true);
    });

    it("should return false if user is not following profile", () => {
      const currentUser = {
        id: 1,
        initiatedFollows: [{ targetUserId: 3 }],
      } as any;
      expect(getIsCurrentUserFollowingProfile(currentUser, 2)).toBe(false);
    });
  });

  describe("updateFollowCache", () => {
    it("should add a follow", () => {
      const oldData = {
        id: 1,
        initiatedFollows: [],
        _count: { initiatedFollows: 0 },
      } as any;
      const result = updateFollowCache(oldData, 2, "add");
      expect(result.initiatedFollows.length).toBe(1);
      expect(result._count.initiatedFollows).toBe(1);
    });

    it("should remove a follow", () => {
      const oldData = {
        id: 1,
        initiatedFollows: [{ targetUserId: 2 }],
        _count: { initiatedFollows: 1 },
      } as any;
      const result = updateFollowCache(oldData, 2, "remove");
      expect(result.initiatedFollows.length).toBe(0);
      expect(result._count.initiatedFollows).toBe(0);
    });
  });

  describe("updateUserProfileFollowStatus", () => {
    it("should update received follows", () => {
      const oldData = {
        receivedFollows: [],
        _count: { receivedFollows: 0 },
      } as any;
      const currentUser = { id: 1, username: "test" } as any;
      const result = updateUserProfileFollowStatus(
        oldData,
        currentUser,
        true,
        "received",
      );
      expect(result.receivedFollows.length).toBe(1);
      expect(result._count.receivedFollows).toBe(1);
    });
  });

  describe("updateCountForPosts", () => {
    it("should increment picture count", () => {
      const oldData = { _count: { pictures: 5 } } as any;
      const result = updateCountForPosts.add(oldData);
      expect(result._count.pictures).toBe(6);
    });

    it("should decrement picture count", () => {
      const oldData = { _count: { pictures: 5 } } as any;
      const result = updateCountForPosts.remove(oldData);
      expect(result._count.pictures).toBe(4);
    });
  });
});
