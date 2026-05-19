export const getProfile = (req, res) => {
  res.json({
    message: "Protected data",
    user: req.user,
  });
};
