function UserBadge() {
  const name = useSelector((state) => state.auth.user.name);
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(logout())}>Logout {name}</button>;
}
