import { useNavigate } from "solid-app-router";

// the navigtator
const navigate = useNavigate();

/**
 * navigateToBlog()
 * 
 * Navigates to the blog page.
 */

export const navigateToBlog = () => {
    navigate('/blog', {replace: true});
}

/**
 * navigates to the portfolios page.
 */

export const navigateToPortfolio = () => {
    navigate('/portfolio', {replace: true});
}