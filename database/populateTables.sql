INSERT INTO user_info VALUES('4', 'Mark', 'Zuckerberg', 'http://graph.facebook.com/4/picture');
INSERT INTO user_info VALUES('100000398898019', 'Wency', 'Zhao', 'http://graph.facebook.com/100000398898019/picture');
INSERT INTO user_info VALUES('559216742', 'Peter', 'Deng', 'http://graph.facebook.com/559216742/picture');
INSERT INTO user_info VALUES('605004640', 'Sangyoun', 'Kim', 'http://graph.facebook.com/605004640/picture');
INSERT INTO user_info VALUES('100000403285180', 'Rakesh', 'Mandhan', 'http://graph.facebook.com/100000403285180/picture');
INSERT INTO user_info VALUES('801574725', 'Roger', 'Zhang', 'http://graph.facebook.com/801574725/picture');

INSERT INTO user_friends VALUES('559216742', '605004640');
INSERT INTO user_friends VALUES('605004640', '801574725');
INSERT INTO user_friends VALUES('605004640', '100000398898019');
INSERT INTO user_friends VALUES('4', '605004640');
INSERT INTO user_friends VALUES('605004640', '100000403285180');
INSERT INTO user_friends VALUES('559216742', '100000398898019');
INSERT INTO user_friends VALUES('100000398898019', '100000403285180');
INSERT INTO user_friends VALUES('4', '559216742');
INSERT INTO user_friends VALUES('559216742', '100000403285180');