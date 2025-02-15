/**
 * Handles your login routes
 *
 * @author Faiz A. Farooqui <faiz@geekyants.com>
 */

import session = require('express-session');
import * as passport from 'passport';

import {
	IRequest, IResponse, INext
} from '../../interfaces/vendors';
import { Session } from '../../middlewares/Http';
import Log from '../../middlewares/Log';

class Login {
	public static show (req: IRequest, res: IResponse): any {
		return res.render('pages/login', {
			title: 'LogIn'
		});
	}

	public static perform (req: IRequest, res: IResponse, next: INext): any {
		req.assert('email', 'E-mail cannot be blank').notEmpty();
		req.assert('email', 'E-mail is not valid').isEmail();
		req.assert('password', 'Password cannot be blank').notEmpty();
		req.assert('password', 'Password length must be atleast 8 characters').isLength({ min: 8 });
		req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

		const errors = req.validationErrors();
		if (errors) {
			req.flash('errors', errors);
			return res.redirect('/login');
		}

		Log.info('Here in the login controller #1!');
		passport.authenticate('local', (err, user, info) => {
			Log.info('Here in the login controller #2!');
			if (err) {
				return next(err);
			}

			if (! user) {
				req.flash('errors', info);
				return res.redirect('/login');
			}

			req.logIn(user, (err) => {
				if (err) {
					return next(err);
				}

				req.flash('success', { msg: 'You are successfully logged in now!' });
				
				const s: Session = req.session
				res.redirect(s.returnTo || '/account');
			});
		})(req, res, next);
	}
}

export default Login;
