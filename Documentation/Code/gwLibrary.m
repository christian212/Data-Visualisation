function F = eofEKF(p)

% FUNCTION EOFKALMAN is the error function to be minimised
%
% Input arguments:
% |_ 'p':   Vector of initial value of the parameters
%           to be optimized.
%
% Output:
% |_ 'F':   Value of the error function.

% 1) Set variables.
% ---------------------------------------------------------------
global gyro_thigh_y_g;
global gyro_shank_y_g;
global acc_thigh_x_g;
global fs_g;
global l1_g;
global l2_g;
global true_angles;
global rmse_offset;

% 3) Estimate the orientation angle using extended Kalman Filter.
% ---------------------------------------------------------------
[theta1, theta2, ~, ~, ~] = fusion_EKF(...
                   gyro_thigh_y_g, gyro_shank_y_g, ...
                   acc_thigh_x_g, acc_thigh_z_g, ...
                   acc_shank_x_g, acc_shank_z_g, ...
                   fs_g, l1_g, l2_g, p);

thigh_angle_EKF = theta1;
shank_angle_EKF = theta1 + theta2;

% 4) Compute the error function.
% ---------------------------------------------------------------
F1 = sqrt(mean((true_angles(1, rmse_offset : end) -  ...
     thigh_angle_EKF(rmse_offset : end)) .^ 2));
F2 = sqrt(mean((true_angles(2, rmse_offset : end) -  ...
     shank_angle_EKF(rmse_offset : end)) .^ 2));

F = F1 + F2;
