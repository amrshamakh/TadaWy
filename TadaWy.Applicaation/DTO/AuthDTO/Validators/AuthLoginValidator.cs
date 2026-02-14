using FluentValidation;

namespace TadaWy.Applicaation.DTO.AuthDTO.Validators
{
    public class AuthLoginValidator:AbstractValidator<AuthLoginDTO>
    {
        public AuthLoginValidator()
        {
            RuleFor(x=>x.Email).NotEmpty().WithMessage("Email is required").EmailAddress().WithMessage("Invalid Email Address");
            RuleFor(x => x.Password).NotEmpty().WithMessage("Password field is required");
        }
    }
}
