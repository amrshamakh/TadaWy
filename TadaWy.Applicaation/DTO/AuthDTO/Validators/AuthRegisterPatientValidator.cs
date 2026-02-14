using FluentValidation;

namespace TadaWy.Applicaation.DTO.AuthDTO.Validators
{
        public class AuthRegisterPatientValidator : AbstractValidator<AuthRegisterPatientDTO>
        {
            public AuthRegisterPatientValidator()
            {
                RuleFor(x => x.Email)
                    .NotEmpty()
                    .EmailAddress();

                RuleFor(x => x.password).NotEmpty().MinimumLength(8).WithMessage("Password should be at least 8 characters").Matches("[A-Z]")
                .WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                    .Matches("[0-9]").WithMessage("Password must contain at least one number.");

                RuleFor(x => x.FirstName)
                    .NotEmpty()
                    .MaximumLength(100);

                RuleFor(x => x.LastName)
                    .NotEmpty()
                    .MaximumLength(100);

                RuleFor(x => x.PhoneNumber)
                    .NotEmpty()
                    .Matches(@"^01[0-9]{9}$")
                    .WithMessage("Invalid Egyptian phone number.");

                RuleFor(x => x.DateOfBirth)
                    .LessThan(DateOnly.FromDateTime(DateTime.Today))
                    .WithMessage("Date of birth must be in the past.");

                RuleFor(x => x.Gendre)
                    .IsInEnum();

            }
        }
    }

