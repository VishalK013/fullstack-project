import React, { useMemo, useTransition } from 'react';
import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishLIst, removeWishList } from '../features/wishlist/WishListSlice';
import { useOptimistic } from 'react';
import { toast } from 'react-toastify';

const WishListButton = ({ productId }) => {
    const dispatch = useDispatch();
    const { items: rawWishlist = [] } = useSelector(state => state.wishlist);

    // 💡 Normalize wishlist items to just an array of productIds
    const wishlist = useMemo(
        () =>
            rawWishlist.map(item =>
                typeof item.product === 'string' ? item.product : item.product._id
            ),
        [rawWishlist]
    );

    const [isPending, startTransition] = useTransition();

    const [optimisticWishlist, setOptimisticWishlist] = useOptimistic(
        wishlist,
        (state, id) => {
            const exists = state.includes(id);
            return exists
                ? state.filter(pid => pid !== id)
                : [...state, id];
        }
    );

    const isInWishlist = optimisticWishlist.includes(productId);

    const handleToggle = () => {
        startTransition(() => setOptimisticWishlist(productId));

        const exists = wishlist.includes(productId);
        if (exists) {
            toast.error("Removed from wishlist", { autoClose: 1000 });
            dispatch(removeWishList(productId));
        } else {
            toast.success("Added to wishlist", { autoClose: 1000 });
            dispatch(addToWishLIst(productId));
        }
    };

    return (
        <IconButton
            onClick={handleToggle}
            sx={{
                position: "absolute",
                top: 10,
                right: 10,
                backgroundColor: "white",
                zIndex: 2,
                borderRadius: "50%",
                boxShadow: 2,
            }}
        >
            {isInWishlist ? (
                <FavoriteIcon sx={{ color: "red" }} />
            ) : (
                <FavoriteBorderIcon sx={{ color: "black" }} />
            )}
        </IconButton>
    );
};

export default WishListButton;
