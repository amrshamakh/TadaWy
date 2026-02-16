using FluentValidation;

namespace TadaWy.Applicaation.DTO.AuthDTO.Validators
{
    public class AuthRegisterDoctorValidator : AbstractValidator<AuthRegisterDoctorDTO>
    {
        public AuthRegisterDoctorValidator()
        {
            RuleFor(x => x.Email)
          .NotEmpty().WithMessage("Email is required.")
          .EmailAddress().WithMessage("Invalid email format.")
          .Must(email => email.EndsWith("@gmail.com"))
          .WithMessage("Email must be a Gmail address (@gmail.com)");


            RuleFor(x => x.password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one number.");

            RuleFor(x => x.SpecializationId)
                .GreaterThan(0)
                .WithMessage("Specialization is required.");

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

            RuleFor(x => x.FileStream)
                .NotNull()
                .WithMessage("License file is required.");

            RuleFor(x => x.FileName)
                .NotEmpty()
                .Must(name =>
                    name.EndsWith(".pdf") ||
                    name.EndsWith(".jpg") ||
                    name.EndsWith(".png"))
                .WithMessage("Only PDF or image files are allowed.");

        }
    }
}
